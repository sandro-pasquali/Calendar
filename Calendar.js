/*
 * topic flagging not finished and not stable
 * do not use
 */

function Calendar(yr,dta)
  {
    this.year = yr || 2001;
    this.bin = dta || new Object(); 

    this.months = new Array(12);
    this.monthFirstDay = new Array(12);
    this.monthDays = new Array(31,28,31,30,31,30,31,31,30,31,30,31);
    // adjust for leap year
    if(((this.year % 4 == 0) && (this.year % 100 != 0)) || (this.year % 400 == 0))
      { this.monthDays[1] = 29; }
    // initialize months
    for(m=0; m <= 11; m++)
      {
        this.months[m] = new Array();
        // attach relevant month data
        this.date = new Date(this.year,m,1); 
        this.monthFirstDay[m] = this.date.getDay();
        /*
         * Initialize days in month. Flags the existence of ANY topic for each
         * day of month, creating this.months[m][t][d];
         */
        for(t in this.bin)
          {
            this.months[m][t] = new Array(31);
            var Tnum = this.bin[t][m];
            for(d=0; d < this.monthDays[m]; ++d)
              {
                this.months[m][t][d] = (Tnum & 1);
                Tnum >>= 1;
              }
          }
      }   
    return;
  }


Calendar.prototype.monthNames = new Array('January','February','March','April','May','June','July','August','September','October','November','December');
Calendar.prototype.weekdays = new Array('Su','Mo','Tu','We','Th','Fr','Sa');

Calendar.prototype.draw = function(targ)
  {
    this.holder = (document.getElementById) ? document.getElementById(targ) : document.all[targ];
    this.monthBreak = 4;
    this.dayPadding = 1;
    this.monthXPadding = 6;
    this.monthYPadding = 6;
    this.dDim = 22 + this.dayPadding;
    this.cXDim = 160 + this.monthXPadding;
    this.cYDim = 171 + this.monthYPadding;
    this.left = 10;
    this.top = 10;
    var calOut = '<DIV ID="YEAR' + this.year + '">';
    var cPadX,cPadY,mTop,dRef,mOffset;
    for(m=0; m <= 11; m++)
      {
        cPadX = parseInt(m%this.monthBreak) * this.cXDim;
        cPadY = parseInt(m/this.monthBreak) * this.cYDim;
        calOut += ('<DIV ID="Y' + this.year + 'M' + m + '" CLASS="MONTH" STYLE="position:absolute; left:' + cPadX + '; top:' + cPadY + ';">');
        mTop = 1;
        dRef = this.months[m];
        mOffset = this.monthFirstDay[m];

        // add the month name (jan, feb, etc.)
        calOut += ('<DIV CLASS="MONTHNAME">' + this.monthNames[m] + '</DIV>');

        // add weekday names (mon, tue, etc)
        for(wd=0; wd <= 6; wd++)
          {
            calOut += ('<DIV CLASS="MONTHWEEKDAY" STYLE="left:' + (this.dDim*wd) + ';">' + this.weekdays[wd] + '</DIV>');
          }

        // add main month calendar
        // note the adjustments for starting position (mOffset)
        for(d=mOffset; d < (this.monthDays[m]+mOffset); d++)
          {
            if(d%7==0 && d>0) { ++mTop; }
            // create day object, with rollovers and click handlers
            calOut += ('<DIV CLASS="DAY" STYLE="left:' + ((d%7)*this.dDim) + ';top:' + (11+mTop*this.dDim) + ';" onclick="Calendar.prototype.click(\'' + this.year + '\',\'' + m + '\',\'' + (d-mOffset) + '\');" onmouseover="Calendar.prototype.roll(this);" onmouseout="Calendar.prototype.roll(this);" STATUS=1>');
            calOut += ('<DIV CLASS="DAYNUMBER" ID="Y' + this.year + 'M' + m + 'D' + (d-mOffset) + '">' + (d+1-mOffset) + '</DIV>');
            calOut += ('</DIV>'); // close day
          }
        calOut += ('</DIV></DIV>'); // close month <DIV>
      }
    this.holder.innerHTML = calOut;
    return;
  }

Calendar.prototype.flagTopic = function(topic)
  {
    var t = topic || 'all';
    $CUR_TOPIC = t;
    for(m=0; m <= 11; m++)
      {
        for(d=0; d < this.monthDays[m]; d++)
          {
            if(t == 'all')
              {
                for(prop in this.bin)
                  {
                    var hit = this.colorCell(prop,m,d);
                    if(hit) break;
                  }
              }
            else if(this.months[m][t]) { this.colorCell(t,m,d); } 
          }
      }
    return;
  }

Calendar.prototype.colorCell = function(topic,m,d)
  {
    var cID = document.all['Y'+this.year+'M'+m+'D'+d].style;
    if(this.months[m][topic][d])
      {
        cID.color = '#ff0000';
        cID.fontWeight = 'bold';
        return true;
      }
    else
      {
        cID.color = '#000000';
        cID.fontWeight = 'normal';
        return false;
      }
  }

Calendar.prototype.click = function(yr,mth,day)
  {
    alert(yr + ' - ' + mth + ' - ' + day);
    return;
  }

Calendar.prototype.roll = function(ref)
  {
    if(ref)
      {
        var sty = ref.style;
        sty.backgroundColor = (ref.STATUS==0) ? '#dddddd' : '#cccccc';
        ref.STATUS = (ref.STATUS==0) ? 1 : 0;
      }
    return;
  }

