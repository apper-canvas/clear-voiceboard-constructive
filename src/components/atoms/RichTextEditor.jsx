import { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const RichTextEditor = ({ value = '', onChange, error, placeholder = 'Start typing...', className }) => {
  const [showPreview, setShowPreview] = useState(false);
  const editorRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
    }
  };

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };
const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      document.execCommand('insertImage', false, url);
    }
  };
  const formatButtons = [
    { icon: 'Bold', command: 'bold', title: 'Bold (Ctrl+B)' },
    { icon: 'Italic', command: 'italic', title: 'Italic (Ctrl+I)' },
    { icon: 'Underline', command: 'underline', title: 'Underline (Ctrl+U)' },
    { icon: 'Strikethrough', command: 'strikethrough', title: 'Strikethrough' },
  ];

  const structureButtons = [
    { icon: 'Heading1', command: 'formatBlock', value: 'h1', title: 'Heading 1' },
    { icon: 'Heading2', command: 'formatBlock', value: 'h2', title: 'Heading 2' },
    { icon: 'Heading3', command: 'formatBlock', value: 'h3', title: 'Heading 3' },
    { icon: 'List', command: 'insertUnorderedList', title: 'Bullet List' },
    { icon: 'ListOrdered', command: 'insertOrderedList', title: 'Numbered List' },
  ];

  const actionButtons = [
{ icon: 'Link', action: insertLink, title: 'Insert Link' },
    { icon: 'Image', action: insertImage, title: 'Insert Image' },
    { icon: 'Quote', command: 'formatBlock', value: 'blockquote', title: 'Blockquote' },
  ];

  const historyButtons = [
    { icon: 'Undo', command: 'undo', title: 'Undo (Ctrl+Z)' },
    { icon: 'Redo', command: 'redo', title: 'Redo (Ctrl+Y)' },
  ];

  const handleKeyDown = (e) => {
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          execCommand('underline');
          break;
        case 'z':
          if (e.shiftKey) {
            e.preventDefault();
            execCommand('redo');
          } else {
            e.preventDefault();
            execCommand('undo');
          }
          break;
        case 'y':
          e.preventDefault();
          execCommand('redo');
          break;
      }
    }
  };

  const stripHtmlTags = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const isEditorEmpty = () => {
    const text = stripHtmlTags(value).trim();
    return text.length === 0;
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 rounded-lg border border-gray-200">
        {/* Format Buttons */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
          {formatButtons.map((btn) => (
            <button
              key={btn.command}
              type="button"
              onClick={() => execCommand(btn.command)}
              title={btn.title}
              className="p-1.5 hover:bg-gray-200 rounded transition-colors"
            >
              <ApperIcon name={btn.icon} size={16} className="text-gray-600" />
            </button>
          ))}
        </div>

        {/* Structure Buttons */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
          {structureButtons.map((btn) => (
            <button
              key={btn.command + (btn.value || '')}
              type="button"
              onClick={() => execCommand(btn.command, btn.value)}
              title={btn.title}
              className="p-1.5 hover:bg-gray-200 rounded transition-colors"
            >
              <ApperIcon name={btn.icon} size={16} className="text-gray-600" />
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
          {actionButtons.map((btn) => (
            <button
              key={btn.icon}
              type="button"
              onClick={btn.action || (() => execCommand(btn.command, btn.value))}
              title={btn.title}
              className="p-1.5 hover:bg-gray-200 rounded transition-colors"
            >
              <ApperIcon name={btn.icon} size={16} className="text-gray-600" />
            </button>
          ))}
        </div>

        {/* History Buttons */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
          {historyButtons.map((btn) => (
            <button
              key={btn.command}
              type="button"
              onClick={() => execCommand(btn.command)}
              title={btn.title}
              className="p-1.5 hover:bg-gray-200 rounded transition-colors"
            >
              <ApperIcon name={btn.icon} size={16} className="text-gray-600" />
            </button>
          ))}
        </div>

        {/* Preview Toggle */}
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          title={showPreview ? 'Hide Preview' : 'Show Preview'}
          className={cn(
            'p-1.5 rounded transition-colors ml-auto',
            showPreview ? 'bg-primary text-white' : 'hover:bg-gray-200 text-gray-600'
          )}
        >
          <ApperIcon name="Eye" size={16} />
        </button>
      </div>

      {/* Editor and Preview Container */}
      <div className={cn('grid gap-3', showPreview ? 'md:grid-cols-2' : 'grid-cols-1')}>
        {/* Editor */}
        <div
          className={cn(
            'relative rounded-lg border transition-colors',
            error ? 'border-error' : isFocused ? 'border-primary ring-2 ring-primary/20' : 'border-gray-300',
            'bg-white'
          )}
        >
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            className={cn(
              'min-h-[200px] max-h-[400px] overflow-y-auto p-3',
              'focus:outline-none',
              'prose prose-sm max-w-none',
              'text-gray-900 placeholder:text-gray-400',
              isEditorEmpty() && 'empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400'
            )}
            data-placeholder={placeholder}
            style={{
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
            }}
          />
        </div>

        {/* Live Preview */}
        {showPreview && (
          <div className="rounded-lg border border-gray-300 bg-gray-50 p-3">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-300">
              <ApperIcon name="Eye" size={16} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Live Preview</span>
            </div>
            <div
              className="min-h-[200px] max-h-[400px] overflow-y-auto prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: value || '<p class="text-gray-400 italic">Preview will appear here...</p>' }}
            />
          </div>
        )}
      </div>

      {/* Character/Word Count */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>
          {stripHtmlTags(value).length} characters
        </span>
        <span>
          {stripHtmlTags(value).split(/\s+/).filter(word => word.length > 0).length} words
        </span>
      </div>

      {/* Styling for editor content */}
      <style jsx>{`
        [contenteditable] h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.67em 0;
        }
        [contenteditable] h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.75em 0;
        }
        [contenteditable] h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin: 0.83em 0;
        }
        [contenteditable] ul,
        [contenteditable] ol {
          margin: 1em 0;
          padding-left: 2em;
        }
        [contenteditable] blockquote {
          margin: 1em 0;
          padding-left: 1em;
          border-left: 3px solid #7C3AED;
          color: #6B7280;
        }
        [contenteditable] a {
          color: #7C3AED;
          text-decoration: underline;
        }
        [contenteditable] p {
          margin: 0.5em 0;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;