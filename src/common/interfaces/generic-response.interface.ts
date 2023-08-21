export interface GenericResponse<T> {
  readonly message: string;
  readonly data?: T;
}
