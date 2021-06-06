using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using CarDealership.Models;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Identity;
using ASPNetCoreApp.Models;
using DinkToPdf.Contracts;
using DinkToPdf;
using CarDealership.Utility;
using System.IO;
using CarDealership.Models.Students;

namespace CarDealership
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            var connection = Configuration.GetConnectionString("DefaultConnection");
            services.AddIdentity<User_, IdentityRole>()
                .AddEntityFrameworkStores<StudentsContext>()
                .AddErrorDescriber<CustomIdentityErrorDescriber>();

            services.AddDbContext<StudentsContext>(options => options.UseSqlServer(connection));

            services.AddMvc().AddJsonOptions(options => {
                options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
            });

            services.AddMvc();

            services.ConfigureApplicationCookie(options =>
            {
                options.Cookie.Name = "SimpleWebApp";
                options.LoginPath = "/";
                options.AccessDeniedPath = "/";
                options.LogoutPath = "/";
                options.Events.OnRedirectToLogin = context =>
                {
                    context.Response.StatusCode = 401;
                    return Task.CompletedTask;
                };
                options.Events.OnRedirectToAccessDenied = context =>
                {
                    context.Response.StatusCode = 401;
                    return Task.CompletedTask;
                };
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, IServiceProvider services)
        {
            CreateUserRoles(services).Wait();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }
            app.UseAuthentication();
            DefaultFilesOptions options = new DefaultFilesOptions();
            options.DefaultFileNames.Clear();
            options.DefaultFileNames.Add("login.html");
            app.UseDefaultFiles(options);
            app.UseStaticFiles();
            app.UseHttpsRedirection();
            app.UseMvc();
        }

        private async Task CreateUserRoles(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = serviceProvider.GetRequiredService<UserManager<User_>>();

            // Создание ролей администратора и пользователя
            if (await roleManager.FindByNameAsync("admin") == null)
            {
                await roleManager.CreateAsync(new IdentityRole("admin"));
            }
            if (await roleManager.FindByNameAsync("user") == null)
            {
                await roleManager.CreateAsync(new IdentityRole("user"));
            }
            if (await roleManager.FindByNameAsync("main_admin") == null)
            {
                await roleManager.CreateAsync(new IdentityRole("main_admin"));
            }

            string mainAdminLogin = "main_admin";
            string mainAdminPassword = "Aa123456!";
            if (await userManager.FindByNameAsync(mainAdminLogin) == null)
            {
                User_ main_admin = new User_ { UserName = mainAdminLogin };
                IdentityResult result = await userManager.CreateAsync(main_admin, mainAdminPassword);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(main_admin, "main_admin");
                }
            }

            // Создание Администратора
            string adminLogin = "admin1";
            string adminPassword = "Aa123456!";
            if (await userManager.FindByNameAsync(adminLogin) == null)
            {
                User_ admin = new User_ { UserName = adminLogin };
                IdentityResult result = await userManager.CreateAsync(admin, adminPassword);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(admin, "admin");
                }
            }

            if (await userManager.FindByNameAsync("admin2") == null)
            {
                User_ admin = new User_ { UserName = "admin2" };
                IdentityResult result = await userManager.CreateAsync(admin, "Aa123456!");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(admin, "admin");
                }
            }
            if (await userManager.FindByNameAsync("admin3") == null)
            {
                User_ admin = new User_ { UserName = "admin3" };
                IdentityResult result = await userManager.CreateAsync(admin, "Aa123456!");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(admin, "admin");
                }
            }
            if (await userManager.FindByNameAsync("admin4") == null)
            {
                User_ admin = new User_ { UserName = "admin4" };
                IdentityResult result = await userManager.CreateAsync(admin, "Aa123456!");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(admin, "admin");
                }
            }
            if (await userManager.FindByNameAsync("admin5") == null)
            {
                User_ admin = new User_ { UserName = "admin5" };
                IdentityResult result = await userManager.CreateAsync(admin, "Aa123456!");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(admin, "admin");
                }
            }

            // Создание Пользователя
            string userEmail = "user@mail.com";
            string userName = "user";
            string userPassword = "Aa123456!";
            if (await userManager.FindByNameAsync(userEmail) == null)
            {
                User_ user = new User_ { Email = userEmail, UserName = userName };
                IdentityResult result = await userManager.CreateAsync(user, userPassword);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(user, "user");
                }
            }
        }
    }
}
