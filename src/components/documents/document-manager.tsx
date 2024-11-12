import { useState } from 'react';
import { api } from '@/trpc/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Folder, File, Plus, Share2, Trash } from 'lucide-react';

export function DocumentManager() {
  const [currentFolderId, setCurrentFolderId] = useState<string | undefined>();
  const [newItemName, setNewItemName] = useState('');
  
  const { data, refetch } = api.document.getFolderContents.useQuery({
    folderId: currentFolderId,
  });
  
  const createFolder = api.document.createFolder.useMutation({
    onSuccess: () => refetch(),
  });
  
  const createDocument = api.document.create.useMutation({
    onSuccess: () => refetch(),
  });

  const handleCreateItem = async (type: 'folder' | 'document') => {
    if (!newItemName) return;
    
    if (type === 'folder') {
      await createFolder.mutateAsync({
        name: newItemName,
        parentId: currentFolderId,
      });
    } else {
      await createDocument.mutateAsync({
        title: newItemName,
        content: '',
        folderId: currentFolderId,
      });
    }
    
    setNewItemName('');
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b p-4 flex items-center gap-4">
        <Input
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="New item name..."
        />
        <Button onClick={() => handleCreateItem('folder')}>
          <Folder className="w-4 h-4 mr-2" />
          New Folder
        </Button>
        <Button onClick={() => handleCreateItem('document')}>
          <File className="w-4 h-4 mr-2" />
          New Document
        </Button>
      </div>
      
      <div className="flex-1 p-4">
        {data?.folders.map((folder) => (
          <div
            key={folder._id.toString()}
            className="flex items-center p-2 hover:bg-secondary rounded-lg cursor-pointer"
            onClick={() => setCurrentFolderId(folder._id.toString())}
          >
            <Folder className="w-4 h-4 mr-2" />
            <span>{folder.name}</span>
          </div>
        ))}
        
        {data?.documents.map((doc) => (
          <div
            key={doc._id.toString()}
            className="flex items-center p-2 hover:bg-secondary rounded-lg"
          >
            <File className="w-4 h-4 mr-2" />
            <span>{doc.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 