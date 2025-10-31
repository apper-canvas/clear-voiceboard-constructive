import routeConfig from "./routes.json";

const customFunctions = {};

export const getRouteConfig = (path) => {
    if (!path || path === "index") path = "/";
    if (!path.startsWith("/")) path = "/" + path;

    if (routeConfig[path]) {
        return routeConfig[path];
    }

    const matches = Object.keys(routeConfig)
        .filter(pattern => matchesPattern(path, pattern))
        .map(pattern => ({
            pattern,
            config: routeConfig[pattern],
            specificity: getSpecificity(pattern)
        }))
        .sort((a, b) => b.specificity - a.specificity);

    return matches[0]?.config || null;
};

function matchesPattern(path, pattern) {
    if (path === pattern) return true;

    if (pattern.includes(":")) {
        const regex = new RegExp("^" + pattern.replace(/:[^/]+/g, "[^/]+") + "$");
        return regex.test(path);
    }

    if (pattern.includes("*")) {
        if (pattern.endsWith("/**/*")) {
            const base = pattern.replace("/**/*", "");
            return path.startsWith(base + "/");
        } else if (pattern.endsWith("/*")) {
            const base = pattern.replace("/*", "");
            const remainder = path.replace(base, "");
            return remainder.startsWith("/") && !remainder.substring(1).includes("/");
        }
    }

    return false;
}

function getSpecificity(pattern) {
    let score = 0;

    if (!pattern.includes("*") && !pattern.includes(":")) {
        score += 1000;
    }

    if (pattern.includes(":")) {
        score += 500;
    }

    if (pattern.includes("/*") && !pattern.includes("/**/*")) {
        score += 300;
    }

    if (pattern.includes("/**/*")) {
        score += 100;
    }

    score += pattern.length;

    return score;
}

function evaluateRule(rule, user) {
    if (rule === "public") return true;
    if (rule === "authenticated") return !!user;

    return evaluateDynamicRule(rule, user);
}

function evaluateDynamicRule(rule, user) {
    if (!user) return false;

    try {
        const contextKeys = Object.keys(user);
        const contextValues = Object.values(user);

        const wrappedRule = rule.trim().startsWith('return')
            ? rule
            : `return (${rule})`;

        const func = new Function(...contextKeys, wrappedRule);
        const result = func(...contextValues);

        return Boolean(result);

    } catch (error) {
        console.error('Error evaluating rule:', rule, error);
        return false;
    }
}

function executeCustomFunction(functionName, user) {
    const func = customFunctions[functionName];

    if (!func) {
        console.error(`Custom function "${functionName}" not found`);
        return false;
    }

    try {
        return Boolean(func(user));
    } catch (error) {
        console.error(`Error executing custom function "${functionName}":`, error);
        return false;
    }
}

export function verifyRouteAccess(config, user) {
    if (!config || !config.allow) {
        return {
            allowed: true,
            redirectTo: null,
            excludeRedirectQuery: false,
            failed: []
        };
    }

    const allowedConfig = config.allow;

    if (allowedConfig.function) {
        const allowed = executeCustomFunction(allowedConfig.function, user);

        return {
            allowed,
            redirectTo: allowed ? null : (allowedConfig.redirectOnDeny || "/login"),
            excludeRedirectQuery: allowedConfig.excludeRedirectQuery === true,
            failed: allowed ? [] : [`Custom function "${allowedConfig.function}" failed`]
        };
    }

    const whenClause = allowedConfig.when || allowedConfig;
    const { conditions = [], operator = "OR" } = whenClause;

    const results = conditions.map(cond => ({
        label: cond.label,
        rule: cond.rule,
        passed: evaluateRule(cond.rule, user)
    }));

    const failed = results.filter(r => !r.passed);

    const allowed = operator === "OR"
        ? results.some(r => r.passed)
        : results.every(r => r.passed);

    let redirectTo = null;
    if (!allowed) {
        redirectTo = allowedConfig.redirectOnDeny || "/login";
    }

    return {
        allowed,
        redirectTo,
        excludeRedirectQuery: allowedConfig.excludeRedirectQuery === true,
        failed: failed.map(f => f.label)
    };
}