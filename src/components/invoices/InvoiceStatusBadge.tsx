import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { InvoiceStatus } from '@/types/invoice';
import { getStatusLabel, getStatusColor, getStatusBg } from '@/utils/invoiceStatus';

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus;
}

export function InvoiceStatusBadge({ status }: InvoiceStatusBadgeProps) {
  return (
    <Badge
      label={getStatusLabel(status)}
      color={getStatusColor(status)}
      backgroundColor={getStatusBg(status)}
    />
  );
}
