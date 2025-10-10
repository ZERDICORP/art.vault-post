declare module 'node-fetch' {
  export default function fetch(url: string, init?: any): Promise<any>;
}

declare module 'form-data' {
  export default class FormData {
    append(name: string, value: any): void;
    getHeaders(): any;
  }
}
