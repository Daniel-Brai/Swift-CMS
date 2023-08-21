import { SetMetadata } from '@nestjs/common';
import { UserRoles } from '../../user/types/role';

export const RoleAllowed = (...role: UserRoles[]) => SetMetadata('roles', role);
