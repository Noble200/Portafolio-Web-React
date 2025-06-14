import React, { useState, useCallback, useEffect } from 'react';
import { Upload, X, FileText, Download, Trash2, Image } from 'lucide-react';

const FileManager = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/upload', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setFiles(data);
      }
    } catch (error) {
      console.error('Error al cargar archivos:', error);
    }
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFiles = async (fileList) => {
    setUploading(true);
    const token = localStorage.getItem('admin_token');

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (response.ok) {
          const result = await response.json();
          setFiles(prev => [result.file, ...prev]);
        }
      } catch (error) {
        console.error('Error al subir archivo:', error);
      }
    }
    setUploading(false);
  };

  const handleFileSelect = (e) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const deleteFile = async (fileId) => {
    if (!window.confirm('¿Estás seguro de eliminar este archivo?')) return;

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/upload/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setFiles(prev => prev.filter(f => f.id !== fileId));
      }
    } catch (error) {
      console.error('Error al eliminar archivo:', error);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType, mimeType) => {
    if (fileType === 'image') {
      return <Image className="w-8 h-8 text-blue-500" />;
    } else if (fileType === 'document') {
      return <FileText className="w-8 h-8 text-red-500" />;
    } else {
      return <FileText className="w-8 h-8 text-gray-500" />;
    }
  };

  const toggleFileSelection = (fileId) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const deleteSelectedFiles = async () => {
    if (selectedFiles.length === 0) return;
    if (!window.confirm(`¿Eliminar ${selectedFiles.length} archivo(s) seleccionado(s)?`)) return;

    const token = localStorage.getItem('admin_token');
    
    for (const fileId of selectedFiles) {
      try {
        await fetch(`/api/upload/${fileId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (error) {
        console.error('Error al eliminar archivo:', error);
      }
    }
    
    setFiles(prev => prev.filter(f => !selectedFiles.includes(f.id)));
    setSelectedFiles([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">Gestión de Archivos</h2>
        <div className="flex space-x-2">
          {selectedFiles.length > 0 && (
            <button
              onClick={deleteSelectedFiles}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Eliminar ({selectedFiles.length})</span>
            </button>
          )}
          <label className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center space-x-2 cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Subir Archivos</span>
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*,.pdf,.txt,.zip,.exe"
            />
          </label>
        </div>
      </div>

      {/* Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          {uploading ? 'Subiendo archivos...' : 'Arrastra archivos aquí'}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          o haz clic en "Subir Archivos" para seleccionar
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Formatos permitidos: imágenes, PDF, TXT, ZIP (máx. 10MB)
        </p>
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {files.map((file) => (
          <div
            key={file.id}
            className={`bg-white rounded-lg shadow border p-4 hover:shadow-md transition-shadow ${
              selectedFiles.includes(file.id) ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <input
                type="checkbox"
                checked={selectedFiles.includes(file.id)}
                onChange={() => toggleFileSelection(file.id)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <button
                onClick={() => deleteFile(file.id)}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col items-center space-y-3">
              {/* File Icon or Preview */}
              {file.file_type === 'image' ? (
                <img
                  src={`/uploads/${file.filename}`}
                  alt={file.original_name}
                  className="w-full h-32 object-cover rounded-md"
                />
              ) : (
                <div className="w-full h-32 bg-gray-100 rounded-md flex items-center justify-center">
                  {getFileIcon(file.file_type, file.mime_type)}
                </div>
              )}

              {/* File Info */}
              <div className="w-full text-center">
                <p className="text-sm font-medium text-gray-900 truncate" title={file.original_name}>
                  {file.original_name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(file.file_size)}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(file.created_at).toLocaleDateString()}
                </p>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 w-full">
                <a
                  href={`/uploads/${file.filename}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-gray-100 text-gray-700 px-3 py-1 rounded text-xs hover:bg-gray-200 text-center"
                >
                  Ver
                </a>
                <a
                  href={`/uploads/${file.filename}`}
                  download={file.original_name}
                  className="flex-1 bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs hover:bg-blue-200 text-center"
                >
                  Descargar
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {files.length === 0 && !uploading && (
        <div className="text-center py-12">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay archivos</h3>
          <p className="mt-1 text-sm text-gray-500">
            Comienza subiendo algunos archivos para tu portafolio
          </p>
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Subiendo archivos...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileManager;