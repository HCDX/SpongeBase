--creation of responsedata

alter view GetSpongeData as
SELECT 
e.Sector as Sector,

		case when  [locationalternate_name] = 'NA' then 
			case when cadcod <>'NA' then convert (nvarchar(200),c.acs_CODE) else 
				case when  b.k_code_n is not null then  b.Pcode else    
							case when  d.governorate is not null then d.Pcode													
													end 
														end 
															end  		
				    
		else 	[locationalternate_name]
			end as PCode,
		 [Funded by] 
 ,[enddate] as Date
  ,[partnername] as [Partner Name]
,[indicatorName] as [Fact]
,[value] as Value

	 
  FROM [LCRP2018].[dbo].[LCRP_2018_R_Combined_Data] a 
			left outer join code_district b on a.[caza]=b.district_AI
			left outer join code_cadastral c on a.cadcod=c.CAD_CODE
			left outer join code_governorate d on a.governorate=d.governorate_ai
			INNER JOIN [LCRP2018].dbo.DatabaseID_And_Sector  AS e ON a.databaseid = e.databaseid
WHERE       partnername <> 'Training'

union all

SELECT 
e.Sector as Sector,

		case when  [locationalternate_name] = 'NA' then 
			case when cadcod <>'NA' then convert (nvarchar(200),c.acs_CODE) else 
				case when  b.k_code_n is not null then  b.Pcode else    
							case when  d.governorate is not null then d.Pcode													
													end 
														end 
															end  		
				    
		else 	[locationalternate_name]
			end as PCode,
		 [Funded by] 
 ,[enddate] as Date
  ,[partnername] as [Partner Name]
,[indicatorName] as [Fact]
,[value] as Value
	 
  FROM [LCRP2017].[dbo].[LCRP_2017_R_Combined_Data] a 
			left outer join code_district b on a.[caza]=b.district_AI
			left outer join code_cadastral c on a.cadcod=c.CAD_CODE
			left outer join code_governorate d on a.governorate=d.governorate_ai
			INNER JOIN [LCRP2017].[dbo].DatabaseID_And_Sector  AS e ON a.databaseid = e.databaseid
WHERE       partnername <> 'Training'


---
select s.*, l.* 
from GetSpongeData s
left join dbo.Locations l on l.Pcode=s.PCode
