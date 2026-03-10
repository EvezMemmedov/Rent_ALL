import { cn } from '@/lib/utils';

type StatusType = 'pending' | 'approved' | 'rejected' | 'requested' | 'rented' | 'returned' | 'completed' | 'cancelled';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'status-pending' },
  approved: { label: 'Approved', className: 'status-approved' },
  rejected: { label: 'Rejected', className: 'status-rejected' },
  requested: { label: 'Requested', className: 'status-pending' },
  rented: { label: 'Rented', className: 'status-rented' },
  returned: { label: 'Returned', className: 'status-approved' },
  completed: { label: 'Completed', className: 'status-completed' },
  cancelled: { label: 'Cancelled', className: 'status-rejected' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] ?? { label: status, className: 'status-pending' };
  return (
    <span className={cn('status-badge', config.className, className)}>
      {config.label}
    </span>
  );
}
