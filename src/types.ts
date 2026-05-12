/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Screen = 'Dashboard' | 'File Explorer' | 'User Management' | 'System Logs';

export interface StorageStat {
  name: string;
  used: string;
  total: string;
  percentage: number;
}

export interface ActivityLog {
  id: string;
  user: string;
  userAvatar: string;
  operation: 'Batch Upload' | 'File Deleted' | 'Permissions Change';
  filePath: string;
  status: 'COMPLETE' | 'SUCCESS' | 'AUDITED';
  timestamp: string;
}

export interface SecurityEvent {
  id: string;
  title: string;
  description: string;
  timeLabel: string;
  type: 'error' | 'warning' | 'info';
}

export interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'pdf' | 'zip' | 'image';
  size: string;
  owner: string;
  ownerInitial: string;
  lastModified: string;
  readOnly?: boolean;
}
