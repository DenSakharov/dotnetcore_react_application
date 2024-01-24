using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace netcorereactapp.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddEntities1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "status_model_id",
                table: "Orders",
                newName: "StatusModelsid");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_StatusModelsid",
                table: "Orders",
                column: "StatusModelsid");

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Statuses_StatusModelsid",
                table: "Orders",
                column: "StatusModelsid",
                principalTable: "Statuses",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Statuses_StatusModelsid",
                table: "Orders");

            migrationBuilder.DropIndex(
                name: "IX_Orders_StatusModelsid",
                table: "Orders");

            migrationBuilder.RenameColumn(
                name: "StatusModelsid",
                table: "Orders",
                newName: "status_model_id");
        }
    }
}
