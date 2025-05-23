export interface Product {
  id: number;
  name: string;
  price: number;
  isIn: boolean;
  releaseDate: string;
  type: 'keyboard' | 'mouse' | 'headphones';
  imageUrl?: string;
  editing?: boolean; // Флаг режима редактирования
  originalData?: Partial<Product>; // Для хранения исходных данных
}