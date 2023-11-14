
export const prompts = {
  schema: (schema: string) => `Generate pure TypeScript interfaces like you would write directly into .ts file. If you have reference to schema starting with '#/components/schemas/' do not create interface for that schema, expect that it is already created. Return please just a typescript interface, no other text. \n${JSON.stringify(schema, null, 2)}`,
  method: (method: string) => `Generate TypeScript methods like you would write directly into .ts file.
For instance, if you have this method in your specification:
"/v2/applications/{application-id}":{
   "get":{
      "description":"Given a application ID, it returns application information including creator, approval and clear programs, global and local schemas, and global state.",
      "operationId":"GetApplicationByID",
      "parameters":[
         {
            "description":"An application identifier",
            "in":"path",
            "name":"application-id",
            "required":true,
            "schema":{
               "type":"integer"
            }
         }
      ],
      "responses":{
         "200":{
            "content":{
               "application/json":{
                  "schema":{
                     "$ref":"#/components/schemas/Application"
                  }
               }
            },
            "description":"Application information"
         },
         "400":{
            "content":{
               "application/json":{
                  "schema":{
                     "$ref":"#/components/schemas/ErrorResponse"
                  }
               }
            },
            "description":"Bad Request"
         },
         "401":{
            "content":{
               "application/json":{
                  "schema":{
                     "$ref":"#/components/schemas/ErrorResponse"
                  }
               }
            },
            "description":"Invalid API Token"
         },
         "404":{
            "content":{
               "application/json":{
                  "schema":{
                     "$ref":"#/components/schemas/ErrorResponse"
                  }
               }
            },
            "description":"Application Not Found"
         },
         "500":{
            "content":{
               "application/json":{
                  "schema":{
                     "$ref":"#/components/schemas/ErrorResponse"
                  }
               }
            },
            "description":"Internal Error"
         },
         "default":{
            "content":{
               
            },
            "description":"Unknown Error"
         }
      },
      "summary":"Get application information.",
      "tags":[
         "public",
         "nonparticipating"
      ]
   }
}

I would like to generate this method: 
 
getApplicationInfo(params: { applicationId: number }): Promise<Application> {
  const { applicationId } = params
  return this.sendGet({ path: /v2/applications/{applicationId} })
}
This was just example please do not output getApplicationInfo method. Generate just method (function) no other texts or descriptions. 
Here is the spec:
${JSON.stringify(method, null, 2)}`,
  interface: (method: string) => `Generate TypeScript method interface like you would write directly into .ts file without implementation.
For instance, if you have this method in your specification:
"/v2/applications/{application-id}":{
   "get":{
      "description":"Given a application ID, it returns application information including creator, approval and clear programs, global and local schemas, and global state.",
      "operationId":"GetApplicationByID",
      "parameters":[
         {
            "description":"An application identifier",
            "in":"path",
            "name":"application-id",
            "required":true,
            "schema":{
               "type":"integer"
            }
         }
      ],
      "responses":{
         "200":{
            "content":{
               "application/json":{
                  "schema":{
                     "$ref":"#/components/schemas/Application"
                  }
               }
            },
            "description":"Application information"
         },
         "400":{
            "content":{
               "application/json":{
                  "schema":{
                     "$ref":"#/components/schemas/ErrorResponse"
                  }
               }
            },
            "description":"Bad Request"
         },
         "401":{
            "content":{
               "application/json":{
                  "schema":{
                     "$ref":"#/components/schemas/ErrorResponse"
                  }
               }
            },
            "description":"Invalid API Token"
         },
         "404":{
            "content":{
               "application/json":{
                  "schema":{
                     "$ref":"#/components/schemas/ErrorResponse"
                  }
               }
            },
            "description":"Application Not Found"
         },
         "500":{
            "content":{
               "application/json":{
                  "schema":{
                     "$ref":"#/components/schemas/ErrorResponse"
                  }
               }
            },
            "description":"Internal Error"
         },
         "default":{
            "content":{
               
            },
            "description":"Unknown Error"
         }
      },
      "summary":"Get application information.",
      "tags":[
         "public",
         "nonparticipating"
      ]
   }
}
 
I would like to generate this method interface: 
 
getApplicationInfo(params: { applicationId: number }): Promise<Application>

This was just example please do not output getApplicationInfo method. Generate just method interface no other texts or descriptions. 
Here is the spec:
${JSON.stringify(method, null, 2)}`,
}
