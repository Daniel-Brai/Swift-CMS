export type GenericResponse<T> =  {
  readonly message: string;
  readonly data?: T;
}
