export interface PageOptionsDto {
  page?: number;
  take?: number;
  skip?: number;
}

export interface IPageMetaParams {
  pageOptionsDto: PageOptionsDto;
  itemCount: number;
}
