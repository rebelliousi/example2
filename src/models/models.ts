export interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: number;
    className?: string;
}


export interface IPagination<T> {
  count: number;
   current_page: number;
   next: string | null;
   previous: string | null;
   total_pages: number;
  results: T[]; 
}

export interface IDocument {
  id: number;
  year?: string;
  text?: string;
  description?: string;
  attachments?: number[];
}