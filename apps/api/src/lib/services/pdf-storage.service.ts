import { Injectable } from '@nestjs/common';

interface StoredPDF {
  id: string;
  filename: string;
  originalName: string;
  buffer: Buffer;
  mimetype: string;
  size: number;
  uploadDate: Date;
  customFilename?: string;
}

@Injectable()
export class PDFStorageService {
  private pdfStorage: Map<string, StoredPDF> = new Map();
  
  // Store PDF in RAM and return storage ID
  storePDF(file: Express.Multer.File, customFilename?: string): string {
    const storageId = this.generateUniqueId();
    
    // Handle custom filename or use original
    let finalFilename = customFilename || file.originalname;
    if (customFilename && !customFilename.endsWith('.pdf')) {
      finalFilename = `${customFilename}.pdf`;
    }
    
    // Sanitize filename
    finalFilename = finalFilename.replace(/[^a-zA-Z0-9._-]/g, '');
    
    const storedPDF: StoredPDF = {
      id: storageId,
      filename: finalFilename,
      originalName: file.originalname,
      buffer: file.buffer,
      mimetype: file.mimetype,
      size: file.size,
      uploadDate: new Date(),
      customFilename: customFilename
    };
    
    this.pdfStorage.set(storageId, storedPDF);
    
    console.log(`PDF stored in RAM: ${finalFilename} (${file.size} bytes)`);
    console.log(`Total PDFs in RAM: ${this.pdfStorage.size}`);
    
    return storageId;
  }
  
  // Retrieve PDF from RAM storage
  retrievePDF(storageId: string): StoredPDF | null {
    return this.pdfStorage.get(storageId) || null;
  }
  
  // Get PDF buffer for download/display
  getPDFBuffer(storageId: string): Buffer | null {
    const pdf = this.pdfStorage.get(storageId);
    return pdf ? pdf.buffer : null;
  }
  
  // Delete PDF from RAM
  deletePDF(storageId: string): boolean {
    const deleted = this.pdfStorage.delete(storageId);
    if (deleted) {
      console.log(`PDF deleted from RAM: ${storageId}`);
      console.log(`Remaining PDFs in RAM: ${this.pdfStorage.size}`);
    }
    return deleted;
  }
  
  // Get storage statistics
  getStorageStats(): {
    totalFiles: number;
    totalSize: number;
    averageSize: number;
    oldestFile: Date | null;
    newestFile: Date | null;
  } {
    const files = Array.from(this.pdfStorage.values());
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    
    return {
      totalFiles: files.length,
      totalSize,
      averageSize: files.length > 0 ? Math.round(totalSize / files.length) : 0,
      oldestFile: files.length > 0 ? new Date(Math.min(...files.map(f => f.uploadDate.getTime()))) : null,
      newestFile: files.length > 0 ? new Date(Math.max(...files.map(f => f.uploadDate.getTime()))) : null,
    };
  }
  
  // List all stored PDFs (without buffers for performance)
  listAllPDFs(): Array<Omit<StoredPDF, 'buffer'>> {
    return Array.from(this.pdfStorage.values()).map(pdf => ({
      id: pdf.id,
      filename: pdf.filename,
      originalName: pdf.originalName,
      mimetype: pdf.mimetype,
      size: pdf.size,
      uploadDate: pdf.uploadDate,
      customFilename: pdf.customFilename
    }));
  }

  // Check if PDF exists
  existsPDF(storageId: string): boolean {
    return this.pdfStorage.has(storageId);
  }

  // Get memory usage info
  getMemoryUsage(): {
    totalFilesInMemory: number;
    totalMemoryUsed: number;
    memoryUsedMB: number;
    memoryUsedGB: number;
  } {
    const stats = this.getStorageStats();
    return {
      totalFilesInMemory: stats.totalFiles,
      totalMemoryUsed: stats.totalSize,
      memoryUsedMB: Math.round(stats.totalSize / (1024 * 1024) * 100) / 100,
      memoryUsedGB: Math.round(stats.totalSize / (1024 * 1024 * 1024) * 100) / 100,
    };
  }
  
  private generateUniqueId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 15);
    return `pdf_${timestamp}_${random}`;
  }
}
