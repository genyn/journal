using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CarDealership.Models.Students
{
    public partial class Event
    {
        public Event()
        {
            Event_Student = new HashSet<Event_Student>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime Date { get; set; }
        public int Type { get; set; }
        public int GroupFk { get; set; }

        public virtual Group Group { get; set; }

        public virtual ICollection<Event_Student> Event_Student { get; set; }
    }
}
