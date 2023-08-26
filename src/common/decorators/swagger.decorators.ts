import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PageDto } from '@common/dtos';

export const ApiPaginatedResponse = <Model extends Type<any>>(model: Model) => {
  return applyDecorators(
    ApiExtraModels(PageDto),
    ApiOkResponse({
      description: `Successfully retrieved list of model: ${model.name}`,
      schema: {
        allOf: [
          { $ref: getSchemaPath(PageDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};
