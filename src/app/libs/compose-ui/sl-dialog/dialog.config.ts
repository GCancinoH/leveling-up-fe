export interface DialogConfig {
    animation?: 'fadeIn' | 'slideUp' | 'zoomIn' | 'none';
    showActions?: boolean;
    backdropClose?: boolean;
    escapeClose?: boolean;
    width?: string;
    height?: string;
    data?: any;
    panelClass?: string | string[];
    position?: 'center' | 'top' | 'bottom';
}
  
export const DEFAULT_CONFIG: DialogConfig = {
    animation: 'fadeIn',
    showActions: true,
    backdropClose: true,
    escapeClose: true,
    width: 'auto',
    height: 'auto',
    position: 'center'
};