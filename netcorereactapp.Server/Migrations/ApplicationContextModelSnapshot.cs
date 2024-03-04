﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using netcorereactapp.Server.Services.PostgreService;

#nullable disable

namespace netcorereactapp.Server.Migrations
{
    [DbContext(typeof(ApplicationContext))]
    partial class ApplicationContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.2")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("netcorereactapp.Server.Models.AttachmentModels", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("AttachmentData")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("StatusModelId")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("StatusModelId");

                    b.ToTable("AttachmentsOfStatuses");
                });

            modelBuilder.Entity("netcorereactapp.Server.Models.LoginModel", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("id"));

                    b.Property<string>("Login")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("character varying(255)");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Role")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("netcorereactapp.Server.Models.OrderModels", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("id"));

                    b.Property<string>("caption")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("character varying(255)");

                    b.Property<DateTime>("date_of_creature")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime>("date_of_edited")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("id");

                    b.HasIndex("caption")
                        .IsUnique();

                    b.ToTable("Orders");
                });

            modelBuilder.Entity("netcorereactapp.Server.Models.StatusEvent", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("DateOfChange")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Message")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("OrderId")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("OrderId");

                    b.ToTable("StatusEventsOfModels");
                });

            modelBuilder.Entity("netcorereactapp.Server.Models.StatusModels", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("OrderId")
                        .HasColumnType("integer");

                    b.Property<int?>("ParentStatusId")
                        .HasColumnType("integer");

                    b.Property<DateTime>("date_of_creature")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("type")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("OrderId");

                    b.HasIndex("ParentStatusId");

                    b.ToTable("StatusesOfOrders");
                });

            modelBuilder.Entity("netcorereactapp.Server.Models.AttachmentModels", b =>
                {
                    b.HasOne("netcorereactapp.Server.Models.StatusModels", "StatusModel")
                        .WithMany("Attachments")
                        .HasForeignKey("StatusModelId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("StatusModel");
                });

            modelBuilder.Entity("netcorereactapp.Server.Models.StatusEvent", b =>
                {
                    b.HasOne("netcorereactapp.Server.Models.OrderModels", "Order")
                        .WithMany("StatusEvents")
                        .HasForeignKey("OrderId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Order");
                });

            modelBuilder.Entity("netcorereactapp.Server.Models.StatusModels", b =>
                {
                    b.HasOne("netcorereactapp.Server.Models.OrderModels", "Order")
                        .WithMany("StatusModels")
                        .HasForeignKey("OrderId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("netcorereactapp.Server.Models.StatusModels", "ParentStatus")
                        .WithMany("ChildStatuses")
                        .HasForeignKey("ParentStatusId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.Navigation("Order");

                    b.Navigation("ParentStatus");
                });

            modelBuilder.Entity("netcorereactapp.Server.Models.OrderModels", b =>
                {
                    b.Navigation("StatusEvents");

                    b.Navigation("StatusModels");
                });

            modelBuilder.Entity("netcorereactapp.Server.Models.StatusModels", b =>
                {
                    b.Navigation("Attachments");

                    b.Navigation("ChildStatuses");
                });
#pragma warning restore 612, 618
        }
    }
}
