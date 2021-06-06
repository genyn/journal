using ASPNetCoreApp.Models;
using CarDealership.Models;
using CarDealership.Models.Students;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CarDealership.Controllers
{
    [Produces("application/json")]
    public class AccountController : Controller
    {
        private readonly StudentsContext _context;
        private readonly UserManager<User_> _userManager;
        private readonly SignInManager<User_> _signInManager;

        public AccountController(UserManager<User_> userManager, SignInManager<User_> signInManager, StudentsContext context)
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [HttpPost]
        [Route("api/account/logoff")]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> LogOff()
        {
            // Удаление куки
            await _signInManager.SignOutAsync();
            var msg = new
            {
                message = "Выполнен выход."
            };
            return Ok(msg);
        }

        [HttpPost]
        [Route("api/Account/isAuthenticated")]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> LogisAuthenticatedOff()
        {
            User_ usr = await GetCurrentUserAsync();
            bool isMain = false;
            if (usr != null)
                isMain = await _userManager.IsInRoleAsync(usr, "main_admin");
            else return NotFound();
            var user = usr;
            var msg = new
            {
                isMain,
                user
            };
            return Ok(msg);

        }
        private Task<User_> GetCurrentUserAsync() => _userManager.GetUserAsync(HttpContext.User);

        [HttpPost]
        [Route("api/Account/Admin/Login")]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> LoginAdmin([FromBody] LoginViewModel model)
        {
            if (ModelState.IsValid)
            {
                User_ user = await _userManager.FindByNameAsync(model.Email);
                var result = Microsoft.AspNetCore.Identity.SignInResult.Failed;

                if (user != null)
                    result = await _signInManager.PasswordSignInAsync(user, model.Password, false, false);

                if (result.Succeeded)
                {
                    bool isUser = await _userManager.IsInRoleAsync(user, "user");
                    bool isMain = await _userManager.IsInRoleAsync(user, "main_admin");

                    int status = 0;
                    if (isUser) status = 1;
                    else if (isMain) status = 3;
                    else status = 2;

                    var message = "";

                    var msg = new
                    {
                        message,
                        status
                    };
                    return Ok(msg);
                }
                else
                {
                    ModelState.AddModelError("", "Неправильный логин и (или) пароль");
                    var errorMsg = new
                    {
                        message = "Вход не выполнен.",
                        error = ModelState.Values.SelectMany(e => e.Errors.Select(er => er.ErrorMessage))
                    };
                    return Ok(errorMsg);
                }
            }
            else
            {
                var errorMsg = new
                {
                    message = "Вход не выполнен.",
                    error = ModelState.Values.SelectMany(e => e.Errors.Select(er => er.ErrorMessage))
                };
                return Ok(errorMsg);
            }
        }
    }
}
