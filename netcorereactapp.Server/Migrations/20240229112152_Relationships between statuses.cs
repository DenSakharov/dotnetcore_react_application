using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace netcorereactapp.Server.Migrations
{
    /// <inheritdoc />
    public partial class Relationshipsbetweenstatuses : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ParentStatusId",
                table: "StatusesOfOrders",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_StatusesOfOrders_ParentStatusId",
                table: "StatusesOfOrders",
                column: "ParentStatusId");

            migrationBuilder.AddForeignKey(
                name: "FK_StatusesOfOrders_StatusesOfOrders_ParentStatusId",
                table: "StatusesOfOrders",
                column: "ParentStatusId",
                principalTable: "StatusesOfOrders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StatusesOfOrders_StatusesOfOrders_ParentStatusId",
                table: "StatusesOfOrders");

            migrationBuilder.DropIndex(
                name: "IX_StatusesOfOrders_ParentStatusId",
                table: "StatusesOfOrders");

            migrationBuilder.DropColumn(
                name: "ParentStatusId",
                table: "StatusesOfOrders");
        }
    }
}
