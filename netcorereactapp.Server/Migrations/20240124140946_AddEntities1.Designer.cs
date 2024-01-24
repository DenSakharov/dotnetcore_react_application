﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using netcorereactapp.Server.Services.PostgreService;

#nullable disable

namespace netcorereactapp.Server.Migrations
{
    [DbContext(typeof(ApplicationContext))]
    [Migration("20240124140946_AddEntities1")]
    partial class AddEntities1
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.1")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

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

                    b.HasIndex("Login")
                        .IsUnique();

                    b.ToTable("Users");
                });

            modelBuilder.Entity("netcorereactapp.Server.Models.OrderModels", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("id"));

                    b.Property<int>("StatusModelsid")
                        .HasColumnType("integer");

                    b.Property<string>("caption")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("character varying(255)");

                    b.Property<DateTime>("date_of_creature")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime>("date_of_edited")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("id");

                    b.HasIndex("StatusModelsid");

                    b.HasIndex("caption")
                        .IsUnique();

                    b.ToTable("Orders");
                });

            modelBuilder.Entity("netcorereactapp.Server.Models.StatusModels", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("id"));

                    b.Property<DateTime>("date_of_creature")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("type")
                        .HasColumnType("integer");

                    b.HasKey("id");

                    b.ToTable("Statuses");
                });

            modelBuilder.Entity("netcorereactapp.Server.Models.OrderModels", b =>
                {
                    b.HasOne("netcorereactapp.Server.Models.StatusModels", "StatusModels")
                        .WithMany()
                        .HasForeignKey("StatusModelsid")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("StatusModels");
                });
#pragma warning restore 612, 618
        }
    }
}
