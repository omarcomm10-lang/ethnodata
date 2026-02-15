import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

type Order = 'asc' | 'desc';

/**
 * Convertit une valeur venant de l'URL (?skip=...&take=...) en nombre.
 * - Si c'est vide => undefined
 * - Si c'est un number => ok
 * - Si c'est un string "12" => ok
 * - Si c'est un objet (bizarre) => undefined
 */
const toIntOrUndefined = ({
  value,
}: {
  value: unknown;
}): number | undefined => {
  if (value === undefined || value === null || value === '') return undefined;

  // ✅ Si c’est déjà un nombre
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined;
  }

  // ✅ Si c’est une chaîne de texte (ex: "20")
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') return undefined;

    const n = Number.parseInt(trimmed, 10);
    return Number.isNaN(n) ? undefined : n;
  }

  // ✅ Si c'est autre chose (objet, tableau, etc.), on ignore
  return undefined;
};

export class ListUsersQueryDto {
  @ApiPropertyOptional({
    example: 0,
    description: "Combien d'éléments on saute (pagination)",
  })
  @IsOptional()
  @Transform(toIntOrUndefined)
  @IsInt()
  @Min(0)
  skip?: number;

  @ApiPropertyOptional({
    example: 20,
    description: "Combien d'éléments on prend (pagination)",
  })
  @IsOptional()
  @Transform(toIntOrUndefined)
  @IsInt()
  @Min(1)
  take?: number;

  @ApiPropertyOptional({
    example: 'alice',
    description: 'Recherche sur name/email (contient)',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    example: 'createdAt',
    description: 'Champ de tri',
    enum: ['createdAt', 'email', 'name'],
  })
  @IsOptional()
  @IsIn(['createdAt', 'email', 'name'])
  sortBy?: 'createdAt' | 'email' | 'name';

  @ApiPropertyOptional({
    example: 'desc',
    description: 'Ordre de tri',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: Order;
}
