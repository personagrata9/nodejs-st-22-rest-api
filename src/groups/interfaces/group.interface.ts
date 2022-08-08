export enum Permission {
  READ = 'READ',
  WRITE = 'WRITE',
  DELETE = 'DELETE',
  SHARE = 'SHARE',
  UPLOAD_FILES = 'UPLOAD_FILES',
}

export type PermissionType = keyof typeof Permission;

export interface IGroup {
  id: string;
  name: string;
  permissions: PermissionType[];
}
