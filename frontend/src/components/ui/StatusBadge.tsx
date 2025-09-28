import React from 'react';
import { CheckCircle, XCircle, Clock, RefreshCw, AlertCircle } from 'lucide-react';

export type StatusType = 'pending' | 'completed' | 'failed' | 'refunded' | 'active' | 'inactive' | 'suspended' | 'draft';

interface StatusBadgeProps {
  status: StatusType;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
  variant?: 'default' | 'outlined' | 'minimal';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'md', 
  showIcon = true, 
  className = '',
  variant = 'default'
}) => {
  const getStatusConfig = (status: StatusType) => {
    switch (status) {
      case 'pending':
        return {
          text: 'Pendiente',
          icon: Clock,
          bgColor: 'bg-amber-50',
          textColor: 'text-amber-800',
          borderColor: 'border-amber-200',
          iconColor: 'text-amber-600',
          shadowColor: 'shadow-amber-100'
        };
      case 'completed':
        return {
          text: 'Completado',
          icon: CheckCircle,
          bgColor: 'bg-emerald-50',
          textColor: 'text-emerald-800',
          borderColor: 'border-emerald-200',
          iconColor: 'text-emerald-600',
          shadowColor: 'shadow-emerald-100'
        };
      case 'failed':
        return {
          text: 'Fallido',
          icon: XCircle,
          bgColor: 'bg-red-50',
          textColor: 'text-red-800',
          borderColor: 'border-red-200',
          iconColor: 'text-red-600',
          shadowColor: 'shadow-red-100'
        };
      case 'refunded':
        return {
          text: 'Reembolsado',
          icon: RefreshCw,
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-200',
          iconColor: 'text-blue-600',
          shadowColor: 'shadow-blue-100'
        };
      case 'active':
        return {
          text: 'Activo',
          icon: CheckCircle,
          bgColor: 'bg-green-50',
          textColor: 'text-green-800',
          borderColor: 'border-green-200',
          iconColor: 'text-green-600',
          shadowColor: 'shadow-green-100'
        };
      case 'inactive':
        return {
          text: 'Inactivo',
          icon: AlertCircle,
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200',
          iconColor: 'text-gray-600',
          shadowColor: 'shadow-gray-100'
        };
      case 'suspended':
        return {
          text: 'Suspendido',
          icon: AlertCircle,
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-200',
          iconColor: 'text-yellow-600',
          shadowColor: 'shadow-yellow-100'
        };
      case 'draft':
        return {
          text: 'Borrador',
          icon: Clock,
          bgColor: 'bg-purple-50',
          textColor: 'text-purple-800',
          borderColor: 'border-purple-200',
          iconColor: 'text-purple-600',
          shadowColor: 'shadow-purple-100'
        };
      default:
        return {
          text: status,
          icon: Clock,
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200',
          iconColor: 'text-gray-600',
          shadowColor: 'shadow-gray-100'
        };
    }
  };

  const config = getStatusConfig(status);
  const IconComponent = config.icon;

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'px-2.5 py-1 text-xs',
          icon: 'w-3 h-3',
          spacing: 'gap-1.5',
          fontWeight: 'font-semibold'
        };
      case 'md':
        return {
          container: 'px-3 py-1.5 text-sm',
          icon: 'w-4 h-4',
          spacing: 'gap-2',
          fontWeight: 'font-semibold'
        };
      case 'lg':
        return {
          container: 'px-4 py-2 text-base',
          icon: 'w-5 h-5',
          spacing: 'gap-2.5',
          fontWeight: 'font-bold'
        };
      default:
        return {
          container: 'px-3 py-1.5 text-sm',
          icon: 'w-4 h-4',
          spacing: 'gap-2',
          fontWeight: 'font-semibold'
        };
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'outlined':
        return `border-2 ${config.borderColor} ${config.textColor} bg-white`;
      case 'minimal':
        return `${config.textColor} bg-transparent border-0`;
      default:
        return `${config.bgColor} ${config.textColor} ${config.borderColor} border shadow-sm ${config.shadowColor}`;
    }
  };

  const sizeClasses = getSizeClasses();
  const variantClasses = getVariantClasses();

  return (
    <span 
      className={`
        inline-flex items-center rounded-full border transition-all duration-200
        hover:scale-105 hover:shadow-md
        ${sizeClasses.container} ${sizeClasses.spacing} ${sizeClasses.fontWeight}
        ${variantClasses}
        ${className}
      `}
    >
      {showIcon && (
        <IconComponent className={`${sizeClasses.icon} ${config.iconColor} flex-shrink-0`} />
      )}
      <span className="whitespace-nowrap">{config.text}</span>
    </span>
  );
};

export default StatusBadge;
