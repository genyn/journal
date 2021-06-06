using Microsoft.EntityFrameworkCore.Migrations;

namespace CarDealership.Migrations.Students
{
    public partial class UpdateNull : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "Mark",
                table: "Event_Student",
                nullable: true,
                oldClrType: typeof(float));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<float>(
                name: "Mark",
                table: "Event_Student",
                nullable: true,
                oldClrType: typeof(int));
        }
    }
}
