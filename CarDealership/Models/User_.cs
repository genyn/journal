using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Identity;

namespace ASPNetCoreApp.Models
{
    public class User_ : IdentityUser
    {
        public string Name { get; set; }
    }
}
