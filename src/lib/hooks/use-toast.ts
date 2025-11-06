// hooks/use-toast.ts
import { toast as sonnerToast } from 'sonner';

interface ToastProps {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  duration?: number;
}

export const useToast = () => {
  const showToast = ({ 
    title, 
    description, 
    variant = 'default',
    duration = 4000 
  }: ToastProps) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const message = description ? `${title}\n${description}` : title;
    
    switch (variant) {
      case 'destructive':
        sonnerToast.error(title, {
          description,
          duration,
          style: {
            background: '#fee2e2',
            border: '1px solid #fecaca',
            color: '#991b1b',
          },
        });
        break;
        
      case 'success':
        sonnerToast.success(title, {
          description,
          duration,
          style: {
            background: '#dcfce7',
            border: '1px solid #bbf7d0',
            color: '#166534',
          },
        });
        break;
        
      case 'warning':
        sonnerToast.warning(title, {
          description,
          duration,
          style: {
            background: '#fef3c7',
            border: '1px solid #fde68a',
            color: '#92400e',
          },
        });
        break;
        
      case 'info':
        sonnerToast.info(title, {
          description,
          duration,
          style: {
            background: '#dbeafe',
            border: '1px solid #bfdbfe',
            color: '#1e40af',
          },
        });
        break;
        
      default:
        sonnerToast(title, {
          description,
          duration,
        });
    }
  };

  return { showToast };
};

// Export également le toast de sonner pour les cas avancés
export { toast as sonnerToast } from 'sonner';