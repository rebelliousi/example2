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

export interface IAdmissionMajor {
  id: number;
  major: number;
  major_name?: string;
  order_number: number;
  quota: number;
  
}

export interface ITab {
    id: number;
    name: string;
    link: string;
}