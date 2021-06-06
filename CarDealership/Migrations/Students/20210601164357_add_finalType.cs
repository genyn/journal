using Microsoft.EntityFrameworkCore.Migrations;

namespace CarDealership.Migrations.Students
{
    public partial class add_finalType : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "FinalType",
                table: "Subject",
                nullable: true,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FinalType",
                table: "Subject");
        }
    }
}
