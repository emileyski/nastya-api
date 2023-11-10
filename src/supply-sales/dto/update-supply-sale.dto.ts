import { PartialType } from '@nestjs/swagger';
import { CreateSupplySaleDto } from './create-supply-sale.dto';

export class UpdateSupplySaleDto extends PartialType(CreateSupplySaleDto) {}
