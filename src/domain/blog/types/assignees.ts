export type Assignees = {
  readonly name: string;
  readonly first_name?: string | null;
  readonly last_name?: string | null;
  readonly email: string;
  readonly permissions: Array<string>;
}
