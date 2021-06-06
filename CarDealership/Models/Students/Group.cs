using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CarDealership.Models.Students
{
    public partial class Group
    {
        public Group()
        {
            Students = new HashSet<Student>();
            Events = new HashSet<Event>();
        }

        public int Id { get; set; }
        public int Course { get; set; }
        public int Number { get; set; }
        public int SubjectFk { get; set; }

        public virtual Subject Subject { get; set; }

        public virtual ICollection<Student> Students { get; set; }
        public virtual ICollection<Event> Events { get; set; }
    }
}
