import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  orderBy,
  query,
  serverTimestamp,
  updateDoc
} from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Observable } from 'rxjs';

export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  active: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private firestore = inject(Firestore);
  private storage = inject(Storage);

  getProducts(): Observable<Product[]> {
    const ref = collection(this.firestore, 'products');
    const ordered = query(ref, orderBy('createdAt', 'desc'));
    return collectionData(ordered, { idField: 'id' }) as Observable<Product[]>;
  }

  async addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    const ref = collection(this.firestore, 'products');
    await addDoc(ref, {
      ...product,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<void> {
    const ref = doc(this.firestore, `products/${id}`);
    await updateDoc(ref, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  }

  async deleteProduct(id: string): Promise<void> {
    const ref = doc(this.firestore, `products/${id}`);
    await deleteDoc(ref);
  }

  async uploadProductImage(file: File): Promise<string> {
    if (!file) {
      throw new Error('No file selected');
    }

    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    const storageRef = ref(this.storage, `products/${filename}`);

    await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  }
}
