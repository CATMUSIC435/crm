export type UserRoleType = 'AGENT' | 'TEAM_LEADER' | 'DIRECTOR' | 'ACCOUNTANT' | 'ADMIN' | 'SUPER_ADMIN';

export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly fullName: string,
    public readonly phone: string,
    public readonly role: UserRoleType,
    public readonly branchId?: string,
    public readonly avatar?: string,
    public readonly exp: number = 0,
    public readonly level: number = 1,
  ) {}

  public isDirector(): boolean {
    return this.role === 'DIRECTOR' || this.role === 'SUPER_ADMIN';
  }

  public isManager(): boolean {
    return this.role === 'TEAM_LEADER' || this.isDirector();
  }
}
