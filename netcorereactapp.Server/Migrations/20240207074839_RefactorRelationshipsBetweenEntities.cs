using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace netcorereactapp.Server.Migrations
{
    /// <inheritdoc />
    public partial class RefactorRelationshipsBetweenEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Statuses_StatusModelsid",
                table: "Orders");

            migrationBuilder.DropIndex(
                name: "IX_Users_Login",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Orders_StatusModelsid",
                table: "Orders");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Statuses",
                table: "Statuses");

            migrationBuilder.DropColumn(
                name: "StatusModelsid",
                table: "Orders");

            migrationBuilder.RenameTable(
                name: "Statuses",
                newName: "StatusesOfOrders");

            migrationBuilder.AddColumn<int>(
                name: "OrderModelsid",
                table: "StatusesOfOrders",
                type: "integer",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_StatusesOfOrders",
                table: "StatusesOfOrders",
                column: "id");

            migrationBuilder.CreateTable(
                name: "AttachmentsOfStatuses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AttachmentData = table.Column<string>(type: "text", nullable: false),
                    StatusModelId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AttachmentsOfStatuses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AttachmentsOfStatuses_StatusesOfOrders_StatusModelId",
                        column: x => x.StatusModelId,
                        principalTable: "StatusesOfOrders",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StatusEventsOfModels",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    DateOfChange = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Message = table.Column<string>(type: "text", nullable: false),
                    OrderId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StatusEventsOfModels", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StatusEventsOfModels_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StatusesOfOrders_OrderModelsid",
                table: "StatusesOfOrders",
                column: "OrderModelsid");

            migrationBuilder.CreateIndex(
                name: "IX_AttachmentsOfStatuses_StatusModelId",
                table: "AttachmentsOfStatuses",
                column: "StatusModelId");

            migrationBuilder.CreateIndex(
                name: "IX_StatusEventsOfModels_OrderId",
                table: "StatusEventsOfModels",
                column: "OrderId");

            migrationBuilder.AddForeignKey(
                name: "FK_StatusesOfOrders_Orders_OrderModelsid",
                table: "StatusesOfOrders",
                column: "OrderModelsid",
                principalTable: "Orders",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StatusesOfOrders_Orders_OrderModelsid",
                table: "StatusesOfOrders");

            migrationBuilder.DropTable(
                name: "AttachmentsOfStatuses");

            migrationBuilder.DropTable(
                name: "StatusEventsOfModels");

            migrationBuilder.DropPrimaryKey(
                name: "PK_StatusesOfOrders",
                table: "StatusesOfOrders");

            migrationBuilder.DropIndex(
                name: "IX_StatusesOfOrders_OrderModelsid",
                table: "StatusesOfOrders");

            migrationBuilder.DropColumn(
                name: "OrderModelsid",
                table: "StatusesOfOrders");

            migrationBuilder.RenameTable(
                name: "StatusesOfOrders",
                newName: "Statuses");

            migrationBuilder.AddColumn<int>(
                name: "StatusModelsid",
                table: "Orders",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Statuses",
                table: "Statuses",
                column: "id");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Login",
                table: "Users",
                column: "Login",
                unique: true);

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
    }
}
