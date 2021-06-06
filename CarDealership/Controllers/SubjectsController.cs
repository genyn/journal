using CarDealership.Models.Students;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CarDealership.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubjectsController : ControllerBase
    {
        private readonly StudentsContext _context;

        public SubjectsController(StudentsContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IEnumerable<Subject> GetAll()
        {
            return _context.Subject.Include(g => g.Groups);
        }

        [HttpGet("{user}")]
        public IEnumerable<Subject> GetAllForUser([FromRoute] string user)
        {
            return _context.Subject.Include(g => g.Groups).Where(s => s.UserName == user);
        }

        [HttpGet("groups")]
        public IEnumerable<Group> GetGroups()
        {
            return _context.Group.Include(g => g.Subject).Where(g => g.Number == _context.Student.Where(s => s.Name == "Васильева В.В.").FirstOrDefault().Group.Number);
        }
    }
}
