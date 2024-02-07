using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace netcorereactapp.Server.Migrations
{
    /// <inheritdoc />
    public partial class RefactorRelationshipsBetweenEntities2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StatusesOfOrders_Orders_OrderModelsid",
                table: "StatusesOfOrders");

            migrationBuilder.DropIndex(
                name: "IX_StatusesOfOrders_OrderModelsid",
                table: "StatusesOfOrders");

            migrationBuilder.DropColumn(
                name: "OrderModelsid",
                table: "StatusesOfOrders");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "StatusesOfOrders",
                newName: "Id");

            migrationBuilder.AddColumn<int>(
                name: "OrderId",
                table: "StatusesOfOrders",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_StatusesOfOrders_OrderId",
                table: "StatusesOfOrders",
                column: "OrderId");

            migrationBuilder.AddForeignKey(
                name: "FK_StatusesOfOrders_Orders_OrderId",
                table: "StatusesOfOrders",
                column: "OrderId",
                principalTable: "Orders",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StatusesOfOrders_Orders_OrderId",
                table: "StatusesOfOrders");

            migrationBuilder.DropIndex(
                name: "IX_StatusesOfOrders_OrderId",
                table: "StatusesOfOrders");

            migrationBuilder.DropColumn(
                name: "OrderId",
                table: "StatusesOfOrders");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "StatusesOfOrders",
                newName: "id");

            migrationBuilder.AddColumn<int>(
                name: "OrderModelsid",
                table: "StatusesOfOrders",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_StatusesOfOrders_OrderModelsid",
                table: "StatusesOfOrders",
                column: "OrderModelsid");

            migrationBuilder.AddForeignKey(
                name: "FK_StatusesOfOrders_Orders_OrderModelsid",
                table: "StatusesOfOrders",
                column: "OrderModelsid",
                principalTable: "Orders",
                principalColumn: "id");
        }
    }
}
