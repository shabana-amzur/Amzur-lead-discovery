import { IsString, IsOptional, IsNumber, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLeadDto {
  @ApiProperty()
  @IsString()
  companyName: string;

  @ApiProperty()
  @IsUrl()
  website: string;

  @ApiProperty()
  @IsString()
  industry: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  employeeCount?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  score?: number;
}

export class UpdateLeadDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  companyName?: string;

  @ApiProperty({ required: false })
  @IsUrl()
  @IsOptional()
  website?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  industry?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  employeeCount?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  score?: number;
}

export class LeadFilterDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  industry?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  minScore?: number;

  @ApiProperty({ required: false, description: 'Filter by geography: US, UK, UAE, Australia' })
  @IsString()
  @IsOptional()
  geography?: string;

  @ApiProperty({ required: false, description: 'Filter by service: MVP as a Service, ERP (NetSuite), AI/ML Services, Custom App Development, Shopify' })
  @IsString()
  @IsOptional()
  service?: string;
}
