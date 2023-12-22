import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';

@Injectable()
export class StatisticsService {
  constructor(private readonly connection: Connection) {}

  async getWeeklySales(): Promise<any[]> {
    const query = `
      SELECT
        EXTRACT(ISODOW FROM s."soldAt") AS day_of_week,
        TO_CHAR(s."soldAt", 'Day') AS day_name,
        SUM(ss."count") AS total_sales_count
      FROM public.sale s
      JOIN public.supply_sale ss ON s.id = ss."saleId"
      GROUP BY day_of_week, day_name
      ORDER BY day_of_week;
    `;

    const result = await this.connection.query(query);
    return result;
  }

  async getTopProvisioners(): Promise<any[]> {
    const query = `
    SELECT
  pr."name" AS provisioner_name,
  pr."address" AS provisioner_address,
  pr."phoneNumber" as "provisioner_phone_number",
  SUM(s."price" * ss."count") AS total_revenue
FROM public.provisioner pr
JOIN public.supply s ON pr.id = s."provisionerId"
JOIN public.supply_sale ss ON s.id = ss."supplyId"
GROUP BY pr.id
ORDER BY total_revenue DESC
LIMIT 5;
    `;

    const result = await this.connection.query(query);
    return result;
  }

  async getTopProducts(): Promise<any[]> {
    const query = `
    SELECT
  p."name" AS product_name,
  SUM(s."count") AS total_quantity_sold
FROM public.product p
JOIN public.supply s ON p.id = s."productId"
JOIN public.supply_sale ss ON s.id = ss."supplyId"
GROUP BY p.id
ORDER BY total_quantity_sold DESC
LIMIT 5;
    `;

    const result = await this.connection.query(query);
    return result.map((r) => ({
      ...r,
      total_quantity_sold: parseInt(r.total_quantity_sold),
    }));
  }
}
