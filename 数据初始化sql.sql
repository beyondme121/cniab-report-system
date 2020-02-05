INSERT INTO [cniab-rms].[dbo].[Products]
SELECT [MaterialNo]
	  ,[Profitcenter]
      ,[ProductType]
	  ,[Frame]
      ,[PowerRate]
	  ,[Voltage]
      ,[ProductGroupText]
      ,[ListPrice]
	  ,1
	  ,GETDATE()
  FROM [CN-S-020BI01].[EDW].[dbo].[RefProductListPrice]