import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const iconMap = {
  success: CheckCircle2,
  error: AlertTriangle,
  info: Info,
};

const bgMap = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const ToastContainer = () => {
  const { toasts, remove } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 w-80">
      {toasts.map((t) => {
        const Icon = iconMap[t.type] || Info;
        const classes = bgMap[t.type] || bgMap.info;
        return (
          <div key={t.id} className={`border rounded-lg shadow-sm ${classes} p-3 flex items-start`}>
            <Icon className="mr-2 mt-0.5" size={18} />
            <div className="flex-1">
              {t.title ? <div className="font-semibold text-sm">{t.title}</div> : null}
              <div className="text-sm leading-snug">{t.message}</div>
            </div>
            <button onClick={() => remove(t.id)} className="ml-2 text-inherit/70 hover:text-inherit">
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
