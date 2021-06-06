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
    public class EventsController : ControllerBase
    {
        private readonly StudentsContext _context;

        public EventsController(StudentsContext context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        public IEnumerable<Event> GetAll([FromRoute] int id)
        {
            return _context.Event.Include(es => es.Event_Student).Where(e => e.GroupFk == id).OrderBy(e => e.Type);
        }

        [HttpGet("student/{id}")]
        public IEnumerable<Event_Student> GetEventStudent([FromRoute] int id)
        {
            return _context.Event_Student.Include(es => es.Student).Where(e => e.EventFk == id);
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] Event_Student event_student)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var item = _context.Event_Student.Find(id);
            if (item == null)
            {
                return NotFound();
            }

            item.N = event_student.N;
            item.Mark = event_student.Mark;

            _context.Event_Student.Update(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("{gid}/{tid}")]
        public IEnumerable<Event> GetEventsOfType([FromRoute] int gid, int tid)
        {
            return _context.Event.Where(e => e.GroupFk == gid && e.Type == tid);
        }

        public class Result
        {
            public string Name { get; set; }
            public Event_Student[] events { get; set; }
            public int markSum { get; set; }
        }

        [HttpGet("table/{gid}/{tid}")]
        public IEnumerable<Result> GetEventsGroupTable([FromRoute] int gid, int tid)
        {
            return _context.Event_Student.Where(e => e.Event.GroupFk == gid && e.Event.Type == tid)
                .OrderBy(e => e.EventFk)
                .GroupBy(e => e.StudentFk)
                .Select(s => new Result { Name = _context.Student.Where(e => e.Id == s.First().StudentFk).FirstOrDefault().Name,
                    events = s.ToArray(),
                    markSum = (int)_context.Event_Student
                                            .Where(e => e.Event.GroupFk == gid && (e.Event.Type == 3 || e.Event.Type == 4) && e.StudentFk == s.First().StudentFk).Sum(t => t.Mark)
                })
                .ToArray();
        }



        [HttpGet("event/{id}")]
        public Event GetEvent([FromRoute] int id)
        {
            return _context.Event.Find(id);
        }

        [HttpPost("{gid}")]
        public async Task<IActionResult> Create([FromRoute] int gid, [FromBody] Event event_)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Event.Add(event_);
            _context.SaveChanges();

            var students = _context.Student.Where(s => s.GroupFk == gid);
            foreach (var student in students)
                _context.Event_Student.Add(new Event_Student { N = false, EventFk = event_.Id, StudentFk = student.Id });

            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] Event event_)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var item = _context.Event.Find(id);
            if (item == null)
            {
                return NotFound();
            }

            item.Name = event_.Name;
            item.Date = event_.Date;

            _context.Event.Update(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var item = _context.Event.Find(id);
            if (item == null)
            {
                return NotFound();
            }

            _context.Event.Remove(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
