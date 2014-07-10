using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;

/// <summary>
/// Summary description for WebService
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
// [System.Web.Script.Services.ScriptService]
public class WebService : System.Web.Services.WebService {

    public WebService () {

        //Uncomment the following line if using designed components 
        //InitializeComponent(); 
    }

   
    [WebMethod]
    public string HelloWorld()
    {
        return "Hello World";
    }

    //This method takes your birth year, month and day, 
    //calculates your age and return the year. 
    [WebMethod]
    public string GetAge(int year, int month, int day)
    {
        DateTime birthDate = new DateTime(year, month, day);
        long age = new DateTime(DateTime.Now.Ticks - birthDate.Ticks).Year - 1;
        return "You are " + age.ToString() + " years old.";
    }

    //This method caches the datetime for 4 seconds. 
    //also a simple cache implementation. 
    private const int CacheTime = 4; // seconds
    [WebMethod(CacheDuration = CacheTime,
    Description = "As simple as it gets - the ubiquitous Get Date Time.")]
    public string GetDateTime()
    {
        return DateTime.Now.ToString();
    }
}
