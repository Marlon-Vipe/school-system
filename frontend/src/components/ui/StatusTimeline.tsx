import React from 'react';
import StatusBadge, { StatusType } from './StatusBadge';

interface StatusTimelineProps {
  statuses: Array<{
    status: StatusType;
    label?: string;
    isActive?: boolean;
    isCompleted?: boolean;
  }>;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

const StatusTimeline: React.FC<StatusTimelineProps> = ({
  statuses,
  orientation = 'horizontal',
  className = ''
}) => {
  const isHorizontal = orientation === 'horizontal';

  return (
    <div className={`flex ${isHorizontal ? 'flex-row items-center' : 'flex-col'} gap-2 ${className}`}>
      {statuses.map((statusItem, index) => (
        <React.Fragment key={index}>
          <div className={`flex ${isHorizontal ? 'flex-col items-center' : 'flex-row items-center'} gap-2`}>
            <StatusBadge
              status={statusItem.status}
              size="sm"
              variant={statusItem.isActive ? 'default' : 'minimal'}
              className={`
                ${statusItem.isCompleted ? 'opacity-100' : 'opacity-60'}
                ${statusItem.isActive ? 'ring-2 ring-offset-1 ring-blue-300' : ''}
                transition-all duration-300
              `}
            />
            {statusItem.label && (
              <span className={`text-xs font-medium ${isHorizontal ? 'text-center' : 'ml-2'} ${
                statusItem.isActive ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {statusItem.label}
              </span>
            )}
          </div>
          {index < statuses.length - 1 && (
            <div className={`
              ${isHorizontal ? 'w-8 h-0.5 bg-gray-200' : 'h-8 w-0.5 bg-gray-200'}
              ${statusItem.isCompleted ? 'bg-green-300' : ''}
              transition-colors duration-300
            `} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StatusTimeline;
