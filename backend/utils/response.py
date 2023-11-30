import pandas


def mongo_docs_to_csv(mongo_docs):
    # restrict the number of docs to export

    #TODO do we have to export for a specific duration
    mongo_docs = mongo_docs[:50]  # slice the list
    print("total docs:", len(mongo_docs))

    # create an empty DataFrame for storing documents
    docs = pandas.DataFrame(mongo_docs)

    # iterate over the list of MongoDB dict documents
    for num, doc in enumerate(mongo_docs):

        # convert ObjectId() to str
        doc["_id"] = str(doc["_id"])
        print(doc['_id'])

        # get document _id from dict
        doc_id = doc["_id"]
        print(doc_id)

        # create a Series obj from the MongoDB dict
        series_obj = pandas.Series(doc, name=doc_id)
        print(series_obj)

        # append the MongoDB Series obj to the DataFrame obj
        # docs = docs.append(series_obj)
        pandas.concat([docs, series_obj])
        print(docs)

    # export MongoDB documents to a CSV file
    #TODO do we have to export for a specific duration what to name the file
    docs.to_csv("responses.csv", ",")  # CSV delimited by commas
