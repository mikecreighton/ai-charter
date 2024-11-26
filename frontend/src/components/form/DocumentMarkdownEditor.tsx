import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useDocuments, DocumentType } from '@/contexts/DocumentContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface DocumentMarkdownEditorProps {
  content: string;
  documentId: DocumentType;
}

export const DocumentMarkdownEditor = ({ content, documentId }: DocumentMarkdownEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const { updateDocument } = useDocuments();

  const handleSave = () => {
    updateDocument(documentId, editedContent);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
        <Textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="min-h-[500px] font-mono"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" onClick={() => setIsEditing(true)}>
          Edit
        </Button>
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]} 
          rehypePlugins={[rehypeRaw]}
          components={{
            h1: ({...props}) => <h1 className="text-3xl font-bold mb-4 mt-6" {...props} />,
            h2: ({...props}) => <h2 className="text-2xl font-bold mb-3 mt-6" {...props} />,
            h3: ({...props}) => <h3 className="text-xl font-bold mb-2 mt-6" {...props} />,
            p: ({...props}) => <p className="text-base mb-4" {...props} />,
            ul: ({...props}) => <ul className="list-disc pl-6 mb-4" {...props} />,
            ol: ({...props}) => <ol className="list-decimal pl-6 mb-4" {...props} />,
            code: ({className, children, ...props}) => {
              const isInline = className?.includes('inline');
              return (
                <code 
                  className={`${isInline ? 'bg-muted px-1.5 py-0.5 rounded text-sm' : 'block bg-muted p-4 rounded-lg text-sm'}`}
                  {...props}
                >
                  {children}
                </code>
              );
            }
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}; 