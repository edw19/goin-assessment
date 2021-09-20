import { Authorized, Query, Resolver } from "type-graphql";
import { UsersModel } from "../../models/Users";
import { ADMIN } from "../roles";

@Resolver()
export class ReportsResolver {
    @Authorized(ADMIN)
    @Query(() => String)
    async getReportSales() {
        try {
            const reports = await UsersModel.where("role", "USER-CLIENT").select("expenses role");
            let sum = 0;
            reports.forEach((report) => {
                report.expenses.forEach(expense => {
                    sum += Number(expense.expense)
                })
            })
            return sum;
        } catch (error) {
            throw new Error(error);
        }
    }
}
