using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CarDealership.Models.Students
{
    public partial class Event_Student
    {
        public int Id { get; set; }
        public bool N { get; set; }
        public int? Mark { get; set; }

        public int EventFk { get; set; }
        public int StudentFk { get; set; }

        public virtual Event Event { get; set; }
        public virtual Student Student { get; set; }
    }
}
